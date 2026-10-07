import { Heading } from "@/components/ui";
export default function Privacy() {
  return (
    <section className="container page legal">
      <Heading title="Confidentialité" />
      <article className="card panel prose">
        <h2>Les informations utilisées</h2>
        <p>
          Votre email sert à l’authentification. Votre nom, vos coordonnées, vos
          demandes, devis, références de paiement et messages permettent à UQONI
          de traiter vos services et de vous assister. Les mots de passe sont
          gérés par Supabase Auth.
        </p>
        <h2>Accès aux données</h2>
        <p>
          Votre espace présente vos propres commandes et projets. Les
          administrateurs UQONI accèdent aux informations nécessaires au
          traitement des demandes. L’application est hébergée sur Vercel et
          utilise Supabase pour l’authentification et la base de données.
        </p>
        <h2>Cookies</h2>
        <p>
          L’application utilise les cookies nécessaires à votre session. Aucun
          outil publicitaire ou de mesure d’audience n’est ajouté dans cette
          version.
        </p>
        <h2>Contact et demandes</h2>
        <p>
          Pour demander une correction, une exportation ou une suppression de
          vos données, écrivez à{" "}
          <a className="text-link" href="mailto:uqoni.pro@gmail.com">
            uqoni.pro@gmail.com
          </a>
          . Les demandes seront examinées en tenant compte des commandes en
          cours et des obligations applicables.
        </p>
        <h2>Informations sensibles</h2>
        <p>
          Ne communiquez jamais de code PIN, de code OTP, de données de carte
          bancaire ou de mots de passe dans vos messages. Seule la référence de
          transaction est demandée pour la vérification manuelle.
        </p>
      </article>
    </section>
  );
}
