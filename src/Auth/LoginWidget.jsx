import { Redirect } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { SpinnerLoading } from '../layouts/utils/SpinnerLoading';

const LoginWidget = ({ config }) => {
  const { oktaAuth, authState } = useOktaAuth();
  const onSuccess = (tokens) => {
    oktaAuth.handleLoginRedirect(tokens);
  };
  const onError = (err) => {
    console.log(`sign in with error : ${err}`);
  };
  if (!authState) {
    return <SpinnerLoading />;
  }
  return authState.isAuthenticated ? (
    <Redirect to={{ pathname: '/' }} />
  ) : (
    <div></div>
  );
};

export default LoginWidget;
