import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { redux } from "@/client/store";
import { PersistGate } from "redux-persist/integration/react";
import { AppStore } from "@/client/store/ReduxStore";
import Layout from "../components/layout";
import { ToastContainer } from "react-toastify";
import ContainerContext from "@/client/ContainerContext";
import container from "@/client/di/container";
import { appWithTranslation } from "next-i18next";
import nextI18nConfig from '@/next-i18next.config'
// import store from '../client/store'

export type GetLayout = (page: React.ReactNode) => React.ReactNode;

export type AppPropsWithLayout = AppProps & {
	Component: AppProps["Component"] & {
		getLayout?: GetLayout;
	};
};

function App({
	Component,
	// pageProps: { session, ...pageProps },
	...rest
}: AppPropsWithLayout) {
	const layout = Component.getLayout || ((page) => <Layout>{page}</Layout>);
	const { store, props } = redux.useWrappedStore(rest);
	// const { store, props } = wrapper.useWrappedStore(rest);
	return (
		<ContainerContext.Provider value={container}>
			<Provider store={store}>
				<PersistGate persistor={(store as AppStore).__persistor}>
					<SessionProvider session={props.session}>
						{layout(<Component {...props.pageProps} />)}
						{/* <Component {...props.pageProps} /> */}
					</SessionProvider>
				</PersistGate>
			</Provider>
			<ToastContainer />
		</ContainerContext.Provider>
	);
}
// export default App;
export default appWithTranslation(App, nextI18nConfig)

// export default function App({ Component, pageProps}: AppProps) {
//   return <Component {...pageProps} />
// }
