import React from 'react';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

import PaymentSetupForm from './../components/PaymentSetupForm/';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe("pk_test_yXKss33cEVIKWJAm1TSM9b1x005igmdMiY");

function App(props) {
  const {id, token, societe} = props.match.params;
  return (
    <Elements stripe={stripePromise}>
      <div className="container" style={{
        width: '50%'
      }}>
        <PaymentSetupForm societe={societe} id={id} token={token} />
      </div>
    </Elements>
  );
};

export default App;