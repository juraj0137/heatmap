import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, Redirect, browserHistory  } from "react-router";
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import {heatmapApp} from './app/reducers';

import LayoutApp from './app/App';
import ViewList from './list/List.react';
import ViewDetail from './detail/Detail.react.js';

class HeatmapAdmin extends React.Component {

    constructor(props) {
        super(props);

        this.store = {};

        const finalCreateStore = compose(
            applyMiddleware(thunk)
        )(createStore);

        //let stateFromLocalstorage = localStorage.getItem(LOCALSTORAGE_NAME);
        let stateFromLocalstorage = null;
        if (stateFromLocalstorage != null) {
            this.store = finalCreateStore(heatmapApp, JSON.parse(stateFromLocalstorage));
        } else {
            this.store = finalCreateStore(heatmapApp);
        }

        this.store.subscribe(() => {
            //const {lastAction} = this.store.getState();
            // console.log(this.store.getState());
            //console.log(lastAction);
        });
    }

    render() {

        return (
            <Provider store={this.store}>
                <Router history={browserHistory}>
                    <Route component={LayoutApp}>
                        <Route path="list" component={ViewList}/>
                        <Route path="detail/:id" component={ViewDetail}/>
                    </Route>
                </Router>
            </Provider>
        );
    }

}

ReactDOM.render(<HeatmapAdmin/>, document.getElementById('react-page'));