# ProperaFront

Propera est une application Web qui comporte
* un front end écrit en Vue/Vuetify
* un back end écrit en go avec le framework iris

ProperaFront est le front end javascript. Il a été conçu avec des versions antérieures de Vue et de Vuetify. Il est régulièrement mis à jour en fonction des livraisons de Vue CLI et de Vuetify ce qui peut conduire à changer de repository sur Github pour éviter de faire un commit qui modifie la quasi totalité des dépendances et pour être sûr que les compilations fonctionnent bien. De plus, ces mises à jour régulières de toutes les dépendances réduisent les risques d'insécurité.

La version actuelle a été générée directement par Vue CLI 4.2.2 et le plugin Vuetify en version 2.2.

Il utilise des paramètres personnalisés :
* Utilisation de Vuex et de Vue Router sans mode history
* Linter/formatter en mode standard
* E2E testing avec Cypress

Il utilise également des paramètres personnalisé de Vuetify
* Utilisation du locale 'fr'
* Utilisation d'un thème personnalisé
* Utilisation de la compilation à la carte
* Utilisation des icônes material design (et non pas mdi comme désormais par défaut)

Le front end gère les paramètres d'authentification grâce à un JWT échangé avec le back end. Les routes sont protégées directement et provoquent une redirection par le router en cas d'accès direct non autorisé.

Le router utilise des chemins dynamiques pour réduire la taille du bundle initial.

## Configuration

### Packages utilisés

En dehors de Vue, Vuetify, Vue router et Vuex, le front end utilise
* Vue ressource pour toutes les requêtes
* *xlsx-populate* pour lire les fichiers Excel utilisés pour importer des données ou pour générer des fichiers Excel pour les exports
* *chart.js* et *vuechartjs* pour les graphiques utilisés dans différents composants
* *vue-debounce*, package qui fournit une directive pour les composants de Vue. Il est utilisé dans les recherches impliquant une requête serveur afin d'offrir une bonne expérience utilisateur sans surcharger le serveur de requêtes
* *vue-currency-input*, une directive qui permet de formatter les composants v-text-field de Vuetify afin d'avoir des saisies de valeurs monétaires lisibles.

### Webpack

La configuration personnalisée utilise les recommandations de Vue CLI :
* Le fichier de configuration utilisé est *vue.config.js*
* Afin de produire des versions compressées des fichiers générés, la configuration utilise *webpack-compression-plugin* 
* Les fichiers *source map* ne sont pas générés en mode production
* Les configurations spécifiques aux modes développement et de production (adresse du backend) sont placés dans *.env.development* et *.env.production*
* Comme Propera a vocation à n'être utilisé que sur un navigateur Chrome récent, le fichier *.browserslistrc* ne vise que les versions les plus récentes de Chrome et exclut la compatibilité avec Internet Explorer

### Eslint

Aucune personnalisation supplémentaire n'a été apportée à celle du CLI en mode standard. Le lint est fait au moment de la sauvegarde et les *fix* sont appliqués directement depuis VSCode, l'EDI utilisé pour le développement du front.

