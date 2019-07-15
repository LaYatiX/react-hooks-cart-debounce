import React, {useContext} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {AnimatedSwitch} from 'react-router-transition';

import MainNavigation from './components/MainNavigation';
import GlobalState from './context/GlobalState';
import ProductsPage from './pages/Products';
import CartPage from './pages/Cart';
import ShopContext from './context/shop-context';
import './App.css';
import DisplayData from "./components/displayData";

const App = props => {
    const context = useContext(ShopContext);
    return (
        <GlobalState>
            <Router>
                <>
                    <MainNavigation
                        cartItemNumber={context.cart.reduce((count, curItem) => {
                            return count + curItem.quantity;
                        }, 0)}
                    />
                    <AnimatedSwitch
                        atEnter={{opacity: 0}}
                        atLeave={{opacity: 0}}
                        atActive={{opacity: 1}}
                        className="switch-wrapper">
                        <Route path="/" component={ProductsPage} exact/>
                        <Route path="/cart" component={CartPage} exact/>
                        <Route path="/data" component={DisplayData} exact/>
                    </AnimatedSwitch>
                </>
            </Router>
        </GlobalState>
    );
};

export default App;
