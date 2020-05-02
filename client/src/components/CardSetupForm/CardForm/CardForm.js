/**
* Use the CSS tab above to style your Element's container.
*/
import React from 'react';
import {CardElement} from '@stripe/react-stripe-js';
import './CardFormStyles.css'

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

function CardSection() {
  return (
    <div className="form-row">
        <label>
          Card details
       </label>
        <CardElement options={CARD_ELEMENT_OPTIONS} />
     </div>
  );
};

export default CardSection;
