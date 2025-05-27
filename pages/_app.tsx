import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { redux } from "@/client/store";
import { PersistGate } from "redux-persist/integration/react";
import { AppStore } from "@/client/store/ReduxStore";
// import store from '../client/store'

export default function App({
	Component,
	// pageProps: { session, ...pageProps },
	...rest
}: AppProps) {
	const { store, props } = redux.useWrappedStore(rest);
	// const { store, props } = wrapper.useWrappedStore(rest);
	return (
		<Provider store={store}>
			<PersistGate persistor={(store as AppStore).__persistor}>
				<SessionProvider session={props.session}>
					<Component {...props.pageProps} />
				</SessionProvider>
			</PersistGate>
		</Provider>
	);
}

// export default function App({ Component, pageProps}: AppProps) {
//   return <Component {...pageProps} />
// }
