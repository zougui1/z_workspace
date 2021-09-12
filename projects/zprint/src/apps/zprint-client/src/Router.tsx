import { BrowserRouter, Switch, Route } from 'react-router-dom';

export const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" />
        {/* page not found */}
        <Route />
      </Switch>
    </BrowserRouter>
  );
}
