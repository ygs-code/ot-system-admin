// import PropTypes from "prop-types";
import {
  Children,
  Component,
  createContext,
  createElement
} from "react";

var createNamedContext = function createNamedContext(name) {
  var context = createContext();
  context.displayName = name;
  return context;
};

const RouterContext = createNamedContext("Router");

class Router extends Component {
  constructor(props) {
    super(props);

    const {history, staticContext} = this.props;

    this.state = {
      location: history.location
    };

    this._isMounted = false;
    this._pendingLocation = null;

    if (!staticContext) {
      this.unlisten = history.listen(({location}) => {
        this._pendingLocation = location;
      });
    }

    return this;
  }
  componentDidMount() {
    this._isMounted = true;

    if (this.unlisten) {
      this.unlisten();
    }

    if (!this.props.staticContext) {
      this.unlisten = this.props.history.listen(({location}) => {
        if (this._isMounted) {
          this.setState({
            location: location
          });
        }
      });
    }

    if (this._pendingLocation) {
      this.setState({
        location: this._pendingLocation
      });
    }
  }

  componentWillUnmount() {
    if (this.unlisten) {
      this.unlisten();
      this._isMounted = false;
      this._pendingLocation = null;
    }
  }
  computeRootMatch = (pathname) => {
    return {
      path: "/",
      url: "/",
      params: {},
      isExact: pathname === "/"
    };
  };
  render() {
    const {children, staticContext, loading, history, routesComponent} =
      this.props;
    const {location} = this.state;
    /* eslint-disable   */
    return createElement(RouterContext.Provider, {
      value: {
        history,
        location,
        staticContext,
        loading,
        routesComponent
      },
      children: children ? Children.only(children) : null
    });
    /* eslint-enable */
  }
}
 

export {RouterContext as __RouterContext, Router};
