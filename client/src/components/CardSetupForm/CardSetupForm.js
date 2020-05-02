import React, { useEffect, useState, useRef } from 'react';
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js';
import axios from './../../util/instanceAxios';
import CardForm from './CardForm/CardForm';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function CheckoutForm(props) {
  const stripe = useStripe();
  const elements = useElements();
  const [autorisationPrelevement, setAutorisationPrelevement] = useState(null);
  const [client, setClient] = useState({})
  const [fileError, setFileError] = useState(null);
  const [cardError, setCardError] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const {id} = props;

  const el = useRef(null);

  useEffect(() => {
    axios.get(`/api/client/get/${id}`)
    .then(({data}) => {
      setClient(data.client);
    }).catch(error => {
      setError(error);
    })
  }, []);


  const handleSubmit = async (event) => {
    el.current.style.border = 'none';
    setError(null);
    setFileError(null);
    setCardError(null);
    setMessage(null);
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    if (!(autorisationPrelevement !== null)) {
      setFileError('Champ Obligatoire');
      el.current.style.border = '1px solid red';
      return;
    }

    setLoading(true);
    stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
      billing_details: {
        email: client.email,
      },
    }).then(({paymentMethod}) => {
      console.log(paymentMethod);
      const formData = new FormData();
      formData.append('id', id);
      formData.append('autorisation_prelevement', autorisationPrelevement);
      formData.append('payment_method', paymentMethod.id);
      axios.post('/api/client/set-card-info/', formData, {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }).then(({data}) => {
        console.log(data);
        setMessage(data.message);
        setLoading(false);
      }).catch(error => {
        setError(error.message);
        setLoading(false)
      })
    }).catch(error => {
      setError(error.message);
      setLoading(false);
    })
  };

  const handleChange = event => {
    setAutorisationPrelevement(event.target.files[0]);
    el.current.style.border = 'none';
    setFileError(null);
  }

  return (
    <form onSubmit={handleSubmit}>
       <CardForm />
      <div className="form-row mt-3">
          <label>Uploader Autorisation de prélèvement</label>
          <input
            ref={el}
            className="form-control" 
            type="file" 
            name="autorisation_prelevement" 
            id="autorisation_prelevement" 
            accept=".pdf,.docx,.doc,.txt"
            onChange={handleChange}/>
       </div>
        {
          fileError !== null ? <div className="alert alert-danger mt-2">{fileError}</div> : null
        }
        {
          loading ? <CircularProgress size={50} /> : <button className="mt-3 btn btn-primary" type="submit" disabled={!stripe}>
        Valider les informations
      </button>
        }
      {
        error !== null ? <div className="alert alert-danger mt-2">{error}</div> : null
      }
      {
        message !== null ? <div className="alert alert-success mt-2">{message}</div> : null
      }
    </form>
  );
}