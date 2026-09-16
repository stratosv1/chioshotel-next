import type { LessonFormula } from "@/lib/mixalis/start-lesson";

function replaceRepeatedly(value: string, pattern: RegExp, replacement: string) {
  let result = value;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const next = result.replace(pattern, replacement);
    if (next === result) break;
    result = next;
  }
  return result;
}

/**
 * START lessons may use Unicode notation (υₓ, ½, √), plain text (v_x,
 * sqrt) or LaTeX (\frac, \sqrt, \theta). The physics contract must compare
 * the meaning of those spellings instead of requiring one typographic form.
 */
export function normalizeLessonFormula(value: string) {
  let normalized = value
    .normalize("NFKC")
    .toLocaleLowerCase("el-GR")
    .replace(/\\(?:left|right)\b/g, "")
    .replace(/\\(?:cdot|times)\b/g, "")
    .replace(/\\theta\b/g, "θ")
    .replace(/\\(?:upsilon|nu)\b/g, "υ")
    .replace(/\\pi\b/g, "π")
    .replace(/\\tan\b/g, "tan");

  // Flatten LaTeX indices before fractions so values such as v_{0}^{2}
  // no longer contain nested braces.
  normalized = replaceRepeatedly(normalized, /[_^]\s*\{([^{}]+)\}/g, "$1");
  normalized = replaceRepeatedly(normalized, /\\(?:mathrm|text)\s*\{([^{}]+)\}/g, "$1");
  normalized = replaceRepeatedly(normalized, /\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, "($1)/($2)");
  normalized = replaceRepeatedly(normalized, /\\sqrt\s*\{([^{}]+)\}/g, "√($1)");

  return normalized
    .replace(/sqrt/g, "√")
    .replace(/(?:εφ|tg)(?=\(?θ)/g, "tan")
    .replace(/v/g, "υ")
    // U+1D67 is commonly used visually as a subscript y, but NFKC expands it
    // to Greek gamma. In this contract it only appears after velocity υ.
    .replace(/υγ/g, "υy")
    .replace(/[⁄∕]/g, "/")
    .replace(/[·⋅×]/g, "")
    .replace(/\*+/g, "")
    .replace(/[−–—]/g, "-")
    .replace(/⇔/g, "=")
    .replace(/[\s_^{}`'()[\]]+/g, "")
    .replace(/\\/g, "");
}

function lessonFormulaText(formulas: LessonFormula[]) {
  return formulas.map((formula) => normalizeLessonFormula(formula.expression)).join("\n");
}

function requireFormula(text: string, alternatives: string[], label: string, errors: string[]) {
  if (!alternatives.some((alternative) => text.includes(normalizeLessonFormula(alternative)))) {
    errors.push(`lesson formula missing '${label}'`);
  }
}

export function assertLessonFormulaContract(subchapterTitle: string, formulas: LessonFormula[]) {
  const errors: string[] = [];
  const text = lessonFormulaText(formulas);
  const title = subchapterTitle.toLocaleLowerCase("el-GR");

  if (title.includes("οριζόντια βολή")) {
    requireFormula(text, ["υx=υ₀", "υ₀=υx"], "υx=υ₀", errors);
    requireFormula(text, ["x=υ₀t", "υ₀t=x"], "x=υ₀t", errors);
    requireFormula(text, ["υy=gt", "υy=-gt", "gt=υy", "-gt=υy"], "υy=gt", errors);
    requireFormula(text, ["y=(1/2)gt²", "y=1/2gt²", "y=gt²/2", "y=0.5gt²"], "y=(1/2)gt²", errors);
    requireFormula(text, ["tπτ=√(2h/g)", "√(2h/g)=tπτ"], "tπτ=√(2h/g)", errors);
    requireFormula(
      text,
      ["υ=√(υx²+υy²)", "√(υx²+υy²)=υ", "υ²=υx²+υy²", "υx²+υy²=υ²"],
      "υ=√(υx²+υy²)",
      errors,
    );
    requireFormula(text, ["tanθ=υy/υx", "tanθ=-υy/υx", "υy/υx=tanθ", "-υy/υx=tanθ"], "tanθ=υy/υx", errors);
    requireFormula(text, ["y=(g/2υ₀²)x²", "y=gx²/2υ₀²"], "y=(g/2υ₀²)x²", errors);
  }

  if (title.includes("ομαλή κυκλική κίνηση")) {
    requireFormula(text, ["s=rφ", "φ=s/r"], "s=rφ", errors);
    requireFormula(text, ["f=1/t", "f=1/T"], "f=1/T", errors);
    requireFormula(text, ["φ=ωt"], "φ=ωt", errors);
    requireFormula(text, ["υ=ωr"], "υ=ωr", errors);
    requireFormula(text, ["ω=2πf", "2πf"], "ω=2πf", errors);
    requireFormula(text, ["αₖ=υ²/r", "ακ=υ²/r"], "αₖ=υ²/r", errors);
    requireFormula(text, ["αₖ=ω²r", "ακ=ω²r"], "αₖ=ω²r", errors);
  }

  if (errors.length) {
    throw new Error(`SMARTLAB lesson-formula audit failed for '${subchapterTitle}': ${errors.join("; ")}`);
  }
}
