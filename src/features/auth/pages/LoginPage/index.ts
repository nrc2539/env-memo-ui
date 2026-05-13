import LoginPage from "./LoginPage";
import withLoginPage from "./withLoginPage";

const ConnectedLoginPage = withLoginPage(LoginPage);

export { ConnectedLoginPage as LoginPage };
