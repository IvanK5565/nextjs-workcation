import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Provider as ReduxProvider } from 'react-redux';
import { redux } from '@/client/store';
import { PersistGate } from 'redux-persist/integration/react';
import { AppStore } from '@/client/store/ReduxStore';
import Layout from '../components/layout';
import { ToastContainer } from 'react-toastify';
import ContainerContext from '@/client/ContainerContext';
import container from '@/client/di/container';
import { appWithTranslation } from 'next-i18next';
import nextI18nConfig from '@/next-i18next.config';
import { Layout as TLayout } from './types';

type AppPropsWithLayout = AppProps & {
	Component: AppProps['Component'] & {
		getLayout?: TLayout;
	};
};

function App({
	Component,
	...rest
}: AppPropsWithLayout) {
	const layout = Component.getLayout || ((page) => <Layout>{page}</Layout>);
	const { store, props } = redux.useWrappedStore(rest);
	return (
		<ContainerContext.Provider value={container}>
			<ReduxProvider store={store}>
				<PersistGate persistor={(store as AppStore).__persistor}>
					<SessionProvider session={props.session}>
						{layout(<Component {...props.pageProps} />)}
					</SessionProvider>
				</PersistGate>
			</ReduxProvider>
			<ToastContainer autoClose={1000} />
		</ContainerContext.Provider>
	);
}
export default appWithTranslation(App, nextI18nConfig);