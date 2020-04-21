Projet CRM: (Jumbo React + Django)

- Documentation
 * Créer un compte Stripe https://stripe.com
 * Créer un nouveau produit dans la partie produit du Dashboard
 * Récupérer l'id et le placer dans la variable PRODUCT_ID de settings.py
 * Nouveau terminal
	$ cd server
	$ pip install -r requirements.txt
	$ python manage.py makemigrations
	$ python manage.py migrate

 * Nouveau terminal
	$ cd client
	$ npm start
 * Aller à l'addresse localhost:3000

 - NB: Changer les clés API de Stripe par les vôtres
 SECRET_KEY : server/server/settings.py
 PUBLIC_KEY: client/src/containers/Payment.js

 Documentation stripe: https://stripe.com/docs/
 Documentation Jumbo React: https://docs.g-axon.com/jumbo-react/
