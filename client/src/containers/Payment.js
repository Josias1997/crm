import React, { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import IbanSetupForm from "./../components/IbanSetupForm/";
import CardSetupForm from "./../components/CardSetupForm/CardSetupForm";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe("pk_test_yXKss33cEVIKWJAm1TSM9b1x005igmdMiY");

function App(props) {
  const [mode, setMode] = useState("iban");
  const { id } = props;
  return (
    <Elements stripe={stripePromise}>
      <div
        className="container"
        style={{
          width: "60%",
        }}
      >
      <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setMode((current) => (current === "iban" ? "card" : "iban"));
          }}
        >
          Changer le mode de paiement
        </button>
        {mode === "iban" ? (
          <IbanSetupForm id={id} />
        ) : (
          <CardSetupForm id={id} />
        )}
      </div>
    </Elements>
  );
}

export default App;
