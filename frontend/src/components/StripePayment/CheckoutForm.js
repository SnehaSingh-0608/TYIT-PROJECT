import { useParams, useSearchParams } from "react-router-dom";
import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useMutation } from "@tanstack/react-query";
import { createStripePaymentIntentAPI } from "../../apis/stripePayment/stripePayment";
import StatusMessage from "../Alert/StatusMessage";

const CheckoutForm = () => {
  // Get the payload
  const params = useParams();
  const [searchParams] = useSearchParams();
  const plan = params.plan;
  const amount = searchParams.get("amount");
  const mutation = useMutation({
    mutationFn: createStripePaymentIntentAPI,

  });

  // Stripe configuration
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (elements === null) {
      return;
    }
    try {
      // Prepare our data for payment
      const data = {
        amount,
        plan,
      };

      // Make the HTTP request
      const response = await mutation.mutateAsync(data);
      console.log(response);

      if (!response || !response.clientSecret) {
        setErrorMessage("Payment failed: No client secret received.");
        return;
      }

      // Submit the elements
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setErrorMessage(submitError.message);
        return;
      }

      // Confirm the payment
     if(mutation?.isSuccess){
      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret: response.clientSecret,
        confirmParams: {
          return_url: "http://localhost:3000/success",
        },
      });
      if (error) {
        setErrorMessage(error.message);
      }
     }
     
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="bg-gray-900 h-screen mt-4 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-96 mx-auto my-4 p-6 bg-white rounded-lg shadow-md"
      >
        <div className="mb-4">
          <PaymentElement />
        </div>
        {/*Display Loading*/ }
          {mutation?.isPending && (<StatusMessage type='loading'
           message='Processing payment...' />)}

        {/*Display success*/ }

          {mutation?.isSuccess && (<StatusMessage type='success'
           message='Payment is successfull' />)}

            {/*Display errror*/ }

          {mutation?.isError && (<StatusMessage type='error'
           message={mutation?.error?.response?.data?.error} />)}


        <button className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Pay
        </button>
        {errorMessage && (
          <div className="text-red-500 mt-4">{errorMessage}</div>
        )}
      </form>
    </div>
  );
};

export default CheckoutForm;
