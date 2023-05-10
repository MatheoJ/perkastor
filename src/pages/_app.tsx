import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import "~/styles/eventForm.css";
import "~/styles/colors.scss";
import "~/styles/text-styles.scss";
import "~/components/buttons/Button.scss";
import "~/styles/sideBar.scss";
import "~/styles/topbar.scss";
import "~/styles/styles.scss";
import "~/styles/fact.css";
import "~/styles/factChainContributions.css";
import "~/styles/factList.scss";
import "~/styles/fact.css";
import "~/styles/historicalFigure.css";
import "~/components/batf/Batf.scss";
import "~/styles/mapStyle.scss";
import "~/components/searchbar/searchbar.css"; 
import "~/styles/factListContributions.css";

import Layout from "../components/layout/layout";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
