import React, {useState, useEffect} from 'react';
import {useStripe, useElements, IbanElement} from '@stripe/react-stripe-js';
import axios from './../../util/instanceAxios';
import './IbanFormStyle.css';


// Custom styling can be passed as options when creating an Element.
const IBAN_STYLE = {
  base: {
    color: '#32325d',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4'
    },
    ':-webkit-autofill': {
      color: '#32325d',
    },
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a',
    ':-webkit-autofill': {
      color: '#fa755a',
    },
  }
};

const IBAN_ELEMENT_OPTIONS = {
  supportedCountries: ['SEPA'],
  // Elements can use a placeholder as an example IBAN that reflects
  // the IBAN format of your customer's country. If you know your
  // customer's country, we recommend that you pass it to the Element as the
  // placeholderCountry.
  placeholderCountry: 'DE',
  style: IBAN_STYLE,
};

export default function PaymentSetupForm(props) {
  const stripe = useStripe();
  const elements = useElements();
  const [autorisationPrelevement, setAutorisationPrelevement] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [client, setClient] = useState({});
  const {id, token} = props;


  useEffect(() => {
    axios.get(`/api/client/get/${id}`)
    .then(({data}) => {
      setClient(data.client);
    }).catch(error => {
      setError(error);
    })
  }, []);

  const handleSubmit = async (event) => {
    setError(null);
    setMessage(null);
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements || client.iban) {
      console.log("Stripe not loaded yet");
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const iban = elements.getElement('iban');
    stripe.createPaymentMethod({
      type: 'sepa_debit',
      sepa_debit: iban,
      billing_details: {
        name: client.societe,
        email: client.email
      }
    }).then(({paymentMethod}) => {
      console.log(paymentMethod);
      const formData = new FormData();
      formData.append('id', id);
      formData.append('token', token);
      formData.append('payment_method', paymentMethod.id);
      formData.append('autorisation_prelevement', autorisationPrelevement);
      axios.post('/api/client/update-iban/', formData, {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }).then(({data}) => {
        console.log(data);
        setMessage(data.message);
      }).catch(error => {
        setError(error);
      })
    }).catch(error => {
      setError(error);
    })
  };

  const handleChange = event => {
    setAutorisationPrelevement(event.target.files[0]);
  }

  return (
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>
            IBAN
          </label>
          <IbanElement options={IBAN_ELEMENT_OPTIONS} onChange={event => {
            if (event.error) {
              setError(event.error);
            } else {
              setError(null);
            }
          }} />
        </div>
        {
          error !== null ? <div className="alert alert-danger mt-2">{error.message}</div> : null
        }
        <div className="form-row mt-3">
            <label>Uploader Autorisation de prélèvement</label>
            <input 
              className="form-control" 
              type="file" 
              name="autorisation_prelevement" 
              id="autorisation_prelevement" 
              accept=".pdf,.docx,.doc,.txt"
              onChange={handleChange}/>
        </div>
        <div className="form-row mt-3">
          <a href="http://localhost:8000/media/files/autorisation_prelevement.pdf">Autorisation Prélèvement.pdf</a>
        </div>
        <button className="mt-3 btn btn-primary" type="submit" disabled={!stripe}>
          Valider Les informations
        </button>
        {
          message !== null ? <div className="alert alert-success mt-2">{message}</div> : null
        }
  
        {/* Display mandate acceptance text. */}
        <div className="mandate-acceptance">
          By providing your IBAN and confirming this payment, you are authorizing
          Company Inc. and Stripe, our payment service provider, to send
          instructions to your bank to debit your account in accordance with those
          instructions. You are entitled to a refund from your bank under the terms
          and conditions of your agreement with your bank. A refund must be claimed
          within eight weeks starting from the date on which your account was debited.
        </div>
      </form>
  );
}