import {
  PlatformPayButton,
  isPlatformPaySupported,
  PlatformPay,
  confirmPlatformPayPayment,
  usePlatformPay,
} from "@stripe/stripe-react-native";
import { useState, useEffect } from "react";
import { View, Alert, Text, Platform } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function PaymentScreen() {
  const [isApplePaySupported, setIsApplePaySupported] = useState(false);
  const { isPlatformPaySupported, confirmPlatformPayPayment } =
    usePlatformPay();

  useEffect(() => {
    (async function () {
      if (!(await isPlatformPaySupported({ googlePay: { testEnv: true } }))) {
        Alert.alert("Google Pay is not supported.");
        return;
      }
    })();
  }, []);

  const fetchGooglePaymentIntentClientSecret = async () => {
    // Fetch payment intent created on the server, see above
    const response = await fetch(
      "http://172.16.0.196:3000/create-payment-intent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currency: "jpy",
        }),
      }
    );
    const { clientSecret } = await response.json();

    return clientSecret;
  };

  const fetchApplePaymentIntentClientSecret = async () => {
    const response = await fetch(
      "http://172.16.0.196:3000/create-payment-intent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const { clientSecret } = await response.json();

    return clientSecret;
  };

  useEffect(() => {
    (async function () {
      setIsApplePaySupported(await isPlatformPaySupported());
    })();
  }, [isPlatformPaySupported]);

  // ...

  const pay = async () => {
    let clientSecret;
    if (Platform.OS === "ios") {
      clientSecret = await fetchApplePaymentIntentClientSecret();
    }
    if (Platform.OS === "android") {
      clientSecret = await fetchGooglePaymentIntentClientSecret();
    }

    const { error, paymentIntent } = await confirmPlatformPayPayment(
      clientSecret as string,
      {
        applePay: {
          merchantCountryCode: "JP",
          currencyCode: "JPY",
          cartItems: [
            {
              paymentType: PlatformPay.PaymentType.Immediate as any,
              label: "にゃんこいん100コイン",
              amount: "1200",
            },
          ],
        },
        googlePay: {
          testEnv: true,
          merchantCountryCode: "JP",
          currencyCode: "JPY",
          merchantName: "にゃんこいん",
          isEmailRequired: true,
          allowCreditCards: true,
          existingPaymentMethodRequired: true,
          billingAddressConfig: {
            format: PlatformPay.BillingAddressFormat.Full,
            isPhoneNumberRequired: true,
            isRequired: true,
          },
          label: "にゃんこいん100コイン",
          amount: 1200,
        },
      }
    );
    if (error) {
      // handle error
      // Alert.alert("Error:", error.message);
      console.log("Error:", error.message);
    } else {
      Alert.alert("Success", "The payment was confirmed successfully.");
    }
  };

  // ...

  return (
    <View>
      {isApplePaySupported && (
        <TouchableOpacity
          onPress={pay}
          render={
            <PlatformPayButton
              onPress={() => {}}
              style={{
                opacity: 0,
              }}
            />
          }>
          <View
            style={{
              width: "100%",
              height: 50,
              backgroundColor: "red",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
              }}>
              Button
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}
