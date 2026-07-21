import { seoSnippetOverrides } from "./seo-snippet-overrides";
import { applyTurkishSeoCorrections } from "./turkish-seo-corrections";

const frenchSeoCorrections: ReadonlyArray<
  readonly [string, { title: string; description: string }]
> = [
  [
    "/fr/",
    {
      title: "Chambres et appartements à Chios | Séjour au calme",
      description:
        "Séjournez à Voulamandis House, dans le quartier historique de Kambos à Chios. Chambres calmes et appartements familiaux près de la ville, de l’aéroport et des plages.",
    },
  ],
  [
    "/fr/chambres-a-chios/",
    {
      title: "Chambres et appartements à Chios | Kambos",
      description:
        "Comparez chambres doubles, chambres triples et appartements familiaux au Voulamandis House, dans le quartier historique de Kambos à Chios.",
    },
  ],
  [
    "/fr/chambres-a-chios/chambres-doubles-standard/",
    {
      title: "Chambres doubles et triples à Chios | Kambos",
      description:
        "Choisissez une chambre double ou triple au Voulamandis House à Kambos : rez-de-chaussée avec accès au jardin ou étage avec terrasse.",
    },
  ],
  [
    "/fr/chambres-a-chios/appartements-familiaux-de-chios/",
    {
      title: "Appartements familiaux à Chios | Cuisine et espace",
      description:
        "Appartements familiaux spacieux de 40 à 45 m² à Kambos, avec cuisine complète, salon et hébergement pour quatre personnes.",
    },
  ],
  [
    "/fr/trouvez-votre-chambre/",
    {
      title: "Trouver une chambre à Chios | Disponibilités en direct",
      description:
        "Indiquez vos dates et le nombre de voyageurs pour consulter les chambres disponibles, comparer le tarif direct et envoyer votre demande au Voulamandis House.",
    },
  ],
  [
    "/fr/tarifs-des-hotels-a-chios/",
    {
      title: "Réservation directe à Chios | Tarifs Voulamandis House",
      description:
        "Vérifiez les disponibilités, choisissez votre chambre ou appartement et réservez directement au Voulamandis House à Kambos, sans commission intermédiaire.",
    },
  ],
  [
    "/fr/villages-de-chios/village-mesta/",
    {
      title: "Mesta Chios | Village fortifié médiéval",
      description:
        "Découvrez Mesta à Chios, un village fortifié médiéval remarquablement préservé, avec ruelles de pierre, passages voûtés et atmosphère authentique.",
    },
  ],
  [
    "/fr/villages-en-bord-de-mer-chios/",
    {
      title: "Villages en bord de mer à Chios | Lagada et Volissos",
      description:
        "Découvrez Lagada et Volissos, deux étapes côtières de Chios avec port, tavernes, château, plages proches et itinéraires détendus.",
    },
  ],
  [
    "/fr/plages-calmes-chios/",
    {
      title: "Plages calmes à Chios | Elinta, Vroulidia et Nagos",
      description:
        "Découvrez Elinta, Vroulidia et Nagos pour profiter de plages paisibles à Chios, d’un paysage naturel, de moins de monde et d’un rythme plus lent.",
    },
  ],
  [
    "/fr/plages-de-chios/plage-komi/",
    {
      title: "Plage de Komi à Chios | Sable, accès et services",
      description:
        "Préparez votre visite à la plage de Komi : sable, eaux peu profondes, transats, restaurants, accès facile et conseils pour les familles.",
    },
  ],
  [
    "/fr/musees-de-chios/",
    {
      title: "Musées de Chios | Histoire, culture et mastic",
      description:
        "Découvrez les principaux musées de Chios consacrés à l’archéologie, l’art byzantin, l’histoire maritime, la littérature, le folklore et le mastic.",
    },
  ],
  [
    "/fr/musees-de-chios/musee-du-mastic-chios/",
    {
      title: "Musée du Mastic de Chios | Guide de visite",
      description:
        "Visitez le Musée du Mastic de Chios et découvrez la culture, la récolte, la transformation et l’histoire du produit emblématique du sud de l’île.",
    },
  ],
  [
    "/fr/ile-de-chios/les-musees-de-chios/",
    {
      title: "Musées de Chios | Histoire, culture et mastic",
      description:
        "Découvrez les principaux musées de Chios consacrés à l’archéologie, l’art byzantin, l’histoire maritime, la littérature, le folklore et le mastic.",
    },
  ],
];

export function applyFrenchSeoCorrections(): void {
  for (const [path, correction] of frenchSeoCorrections) {
    seoSnippetOverrides.set(path, correction);
  }

  // This module is the localized correction bootstrap used by seo-title-overrides.
  applyTurkishSeoCorrections();
}