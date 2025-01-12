import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { GenerateStudyPlan } from "./pages/GenerateStudyPlan";
import { UserProfile } from "./pages/UserProfile";
import App from "./App";

export const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/generate" component={GenerateStudyPlan} />
        <Route path="/profile" component={UserProfile} />
      </Switch>
    </Router>
  );
};
