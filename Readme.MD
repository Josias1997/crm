Projet CRM: (Jumbo React + Django)

- Documentation
Running

    docker-compose build
    docker-compose up
    There should now be two servers running:

    http://127.0.0.1:8000 is the Django app
    http://127.0.0.1:3000 is the React app

Using docker-compose run to issue one-off commands

If you want to run a one-off command, like installing dependencies, you can use the docker-compose run <service_name> <cmd>.

For example, to install a Javascript dependency and save that information to package.json we could run: docker-compose run --rm frontend npm install --save axios

If you want to be on a shell for one of the Docker services, you can do something like: docker-compose run --rm frontend sh

 - NB: Changer les clés API de Stripe par les vôtres
 SECRET_KEY : server/server/settings.py
 PUBLIC_KEY: client/src/containers/Payment.js

 Documentation stripe: https://stripe.com/docs/
 Documentation Jumbo React: https://docs.g-axon.com/jumbo-react/
