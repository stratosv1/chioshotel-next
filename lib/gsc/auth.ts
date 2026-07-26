const STS_URL = "https://sts.googleapis.com/v1/token";
const IAM_SCOPE = "https://www.googleapis.com/auth/cloud-platform";
const WEBMASTERS_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

type GcpConfig = {
  projectNumber: string;
  poolId: string;
  providerId: string;
  serviceAccountEmail: string;
};

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

export function getGcpConfig(): GcpConfig {
  return {
    projectNumber: requireEnv("GCP_PROJECT_NUMBER"),
    poolId: requireEnv("GCP_WORKLOAD_IDENTITY_POOL_ID"),
    providerId: requireEnv("GCP_WORKLOAD_IDENTITY_PROVIDER_ID"),
    serviceAccountEmail: requireEnv("GCP_SERVICE_ACCOUNT_EMAIL"),
  };
}

function getVercelOidcToken(request: Request): string {
  const fromHeader = request.headers.get("x-vercel-oidc-token")?.trim();
  const fromEnv = process.env.VERCEL_OIDC_TOKEN?.trim();
  const token = fromHeader || fromEnv;
  if (!token) {
    throw new Error("Vercel OIDC token is unavailable. Run this endpoint on Vercel Production.");
  }
  return token;
}

async function readError(response: Response): Promise<string> {
  const text = await response.text();
  try {
    const parsed = JSON.parse(text);
    return parsed?.error?.message || parsed?.error_description || parsed?.error || text;
  } catch {
    return text;
  }
}

/**
 * Exchanges the short-lived Vercel OIDC token for a Google federated token,
 * then impersonates the dedicated Search Console service account.
 * No service-account private key is stored in Vercel.
 */
export async function getSearchConsoleAccessToken(request: Request): Promise<string> {
  const config = getGcpConfig();
  const subjectToken = getVercelOidcToken(request);
  const audience = `//iam.googleapis.com/projects/${config.projectNumber}/locations/global/workloadIdentityPools/${config.poolId}/providers/${config.providerId}`;

  const stsResponse = await fetch(STS_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      audience,
      grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
      requested_token_type: "urn:ietf:params:oauth:token-type:access_token",
      scope: IAM_SCOPE,
      subject_token: subjectToken,
      subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
    }),
    cache: "no-store",
  });

  if (!stsResponse.ok) {
    throw new Error(`Google STS exchange failed (${stsResponse.status}): ${await readError(stsResponse)}`);
  }

  const sts = (await stsResponse.json()) as { access_token?: string };
  if (!sts.access_token) throw new Error("Google STS response did not contain an access token.");

  const impersonationUrl = `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${encodeURIComponent(config.serviceAccountEmail)}:generateAccessToken`;
  const iamResponse = await fetch(impersonationUrl, {
    method: "POST",
    headers: {
      authorization: `Bearer ${sts.access_token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      scope: [WEBMASTERS_SCOPE],
      lifetime: "3600s",
    }),
    cache: "no-store",
  });

  if (!iamResponse.ok) {
    throw new Error(`Service account impersonation failed (${iamResponse.status}): ${await readError(iamResponse)}`);
  }

  const iam = (await iamResponse.json()) as { accessToken?: string };
  if (!iam.accessToken) throw new Error("IAM Credentials response did not contain an access token.");
  return iam.accessToken;
}
