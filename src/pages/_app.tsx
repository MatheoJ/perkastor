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
import "~/styles/topbar.css";
import "~/components/batf/Batf.scss";
import Layout from "../components/layout/layout";

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
