import { AppRouter } from "./router/AppRouter";
import { Toaster } from "@/components/ui/sonner";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { config } from "./config/environment";
const stripePromise = loadStripe(config.publicApiKey);
function App() {
  return (
    <div>
      <Elements stripe={stripePromise}>
        <AppRouter />
        <Toaster
          position="top-right"
          expand={true}
          richColors={true}
          closeButton={true}
        />
      </Elements>
    </div>
  )
}

export default App
