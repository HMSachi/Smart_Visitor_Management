import { Provider } from 'react-redux';
import store from './store';
import Layout from './layout/Layout';
import DataFetcher from './layout/Login/Login';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Layout>
        <div className="app-content">
          <DataFetcher />
        </div>
      </Layout>
    </Provider>
  );
}

export default App;
