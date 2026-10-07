import { Heading } from "@/components/ui";
export default function Terms() {
  return (
    <section className="container page legal">
      <Heading title="Conditions d’utilisation" />
      <article className="card panel prose">
        <h2>Votre espace UQONI</h2>
        <p>
          Cet espace permet de découvrir des services, demander un devis et
          suivre vos commandes et projets. Vous devez utiliser des coordonnées
          exactes et garder votre accès personnel confidentiel.
        </p>
        <h2>Devis et commande</h2>
        <p>
          Une demande de devis est gratuite et ne déclenche aucun paiement.
          UQONI propose un périmètre, des livrables, des délais et un montant en
          FCFA. Vérifiez ces éléments avant d’accepter. Les conditions
          spécifiques de la prestation figurent dans le devis et, le cas
          échéant, le contrat associé.
        </p>
        <h2>Paiement</h2>
        <p>
          Les coordonnées de paiement sont communiquées par UQONI. Le client
          transmet une référence après règlement. La saisie de cette référence
          ne confirme pas l’encaissement. UQONI vérifie le paiement avant de
          lancer la production.
        </p>
        <h2>Livraison et assistance</h2>
        <p>
          Les mises à jour et les liens de livrables sont disponibles dans votre
          espace. Les droits d’usage, révisions, annulations et éventuels
          remboursements sont précisés dans les conditions de votre devis. Pour
          toute question, contactez l’assistance ou{" "}
          <a className="text-link" href="mailto:uqoni.pro@gmail.com">
            uqoni.pro@gmail.com
          </a>
          .
        </p>
      </article>
    </section>
  );
}
