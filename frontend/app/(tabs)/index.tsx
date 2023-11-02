import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Linking,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import {
  StripeProvider,
  useStripe,
  PlatformPayButton,
  isPlatformPaySupported,
  PlatformPay,
} from "@stripe/stripe-react-native";

const CheckoutScreen = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const fetchPaymentSheetParams = async () => {
    const response = await fetch("http://172.16.0.196:3000/payment-sheet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { paymentIntent, ephemeralKey, customer } = await response.json();

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer, publishableKey } =
      await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: "keita",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      returnURL: "expo_stripe://",
      defaultBillingDetails: {
        name: "keita namazue",
      },
      applePay: {
        merchantCountryCode: "US",
      },
      googlePay: {
        merchantCountryCode: "US",
      },
    });
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert("Success", "Your order is confirmed!");
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <TouchableOpacity
        onPress={openPaymentSheet}
        disabled={!loading}
        style={{ backgroundColor: "red", padding: 24 }}>
        <Text>Checkout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function App() {
  const { handleURLCallback } = useStripe();

  const handleDeepLink = useCallback(
    async (url: string | null) => {
      if (url) {
        const stripeHandled = await handleURLCallback(url);
        if (stripeHandled) {
          // This was a Stripe URL - you can return or add extra handling here as you see fit
        } else {
          // This was NOT a Stripe URL – handle as you normally would
        }
      }
    },
    [handleURLCallback]
  );

  useEffect(() => {
    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL();
      handleDeepLink(initialUrl);
    };

    getUrlAsync();

    const deepLinkListener = Linking.addEventListener(
      "url",
      (event: { url: string }) => {
        handleDeepLink(event.url);
      }
    );

    return () => deepLinkListener.remove();
  }, [handleDeepLink]);

  return (
    <StripeProvider
      publishableKey="pk_test_51O6oJEHLuL68sllN6hY4XNLh5gmMSrZv3umLJtzKJLX2TUj7BcGLObQciH5EZVHe4jE7TOSVKM39mfkRsBJg4Pln00qoWK6zkh"
      merchantIdentifier="merchant.com.keitanamazue.stripe" // required for Apple Pay
    >
      <CheckoutScreen />
    </StripeProvider>
  );
}
