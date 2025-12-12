import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/storeIndex.ts";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import AxiosInterceptor from "./components/AxiosInterceptor.tsx";
import { initDatadogRum } from "./services/datadog.ts";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
	throw new Error("Missing Publishable Key");
}

// initDatadogRum();

function Root() {
	return (
		<ClerkProvider publishableKey={PUBLISHABLE_KEY}>
			<Provider store={store}>
				<AxiosInterceptor>
					<App />
				</AxiosInterceptor>
			</Provider>
		</ClerkProvider>
	);
}

const root = createRoot(document.getElementById("root")!);

root.render(
	<BrowserRouter>
		<Root />
	</BrowserRouter>
);
