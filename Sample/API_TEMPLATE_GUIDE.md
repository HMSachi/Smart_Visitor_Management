# API Call Template - Frontend UI Guide

This template demonstrates how to make API calls from your React frontend using Redux and Axios.

## Architecture Overview

```
Redux Flow:
┌─────────────────────────────────────────────────┐
│  Component (DataFetcher.js)                     │
│  - Displays UI                                  │
│  - Dispatches actions on user interaction       │
└────────────┬────────────────────────────────────┘
             │ dispatch()
             ▼
┌─────────────────────────────────────────────────┐
│  Actions (actions/index.js)               │
│  - fetchDataThunk() - Async API call            │
│  - fetchDataRequest()                           │
│  - fetchDataSuccess()                           │
│  - fetchDataFailure()                           │
└────────────┬────────────────────────────────────┘
             │
             ▼ dispatch to
┌─────────────────────────────────────────────────┐
│  Reducers (reducers/index.js)             │
│  - Updates state based on actions               │
└─────────────────────────────────────────────────┘
             │ state update
             ▼
┌─────────────────────────────────────────────────┐
│  Store (store.js)                         │
│  - Centralized state management                 │
└─────────────────────────────────────────────────┘
             │ subscribe/select
             ▼
┌─────────────────────────────────────────────────┐
│  Component (DataFetcher.js)                     │
│  - Re-renders with new state                    │
└─────────────────────────────────────────────────┘
```

## File Structure

```
src/
├────
│   ├── Layout/
│   │   └──Login/
│   │         └── Login.js        # Data fetch and UI
│   ├── constants/
│   │   └── LoginConstants.js     # Action type constants
│   ├── actions/
│   │   └── LoginAction.js        # Action creators & thunks
│   ├── reducers/
│   │   └── LoginReducer.js       # State reducers
│   ├── services/
│   │   └── LoginService.js       # Axios API client
│   └── store.js                  # Redux store configuration
├── components/
│   └── Header.js                 # Component styles
│            
│   
├── App.js                        # Main app with Redux Provider
└── index.js                      # Base
```

## Step-by-Step Usage

### 1. Setting Up the Store

The Redux store is already configured in `store.js` using Redux Toolkit:

```javascript
import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk"; 
import { composeWithDevTools } from "redux-devtools-extension";
import loginReducer from "./reducers/LoginReducer";


 const reducer = combineReducers({
    login: loginReducer,
});

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(thunk))
);
export default store;

```

### 2. Using Actions to Fetch Data

The `fetchDataThunk` action in `actions/LoginAction.js` handles API calls:

```javascript
export const GetLogin = () => {
    return async (dispatch) => {
        dispatch({ type: ATTENDANCE_REQUEST });
        try {
            const response = await loginService.GetLogin();
            dispatch({ type: ATTENDANCE_SUCCESS, payload: response.data });
        } catch (error) {
            dispatch({ type: ATTENDANCE_FAILURE, payload: error.message });
        }
    };
};
```

### 3. Using Redux in Components

The `DataFetcher` component shows how to use Redux in a React component:

```javascript
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../../actions/LoginAction";

const DataFetcher = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.data);

    const dispatch = useDispatch();
    const { data, loading, error } = useSelector((state) => state.data);
    
    useEffect(() => {
        dispatch(fetchData());
    }, [dispatch]);

 
  return (
    <div>
      {data.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};
```

## API Service Configuration

The `apiService` in `services/LoginService.js` provides methods for all HTTP requests:

```javascript
 
import axios from 'axios';

 
const GetLogin = async () => {

    let config = {
        method: 'get',
        url: 'login/login' 
};
return axios.requeest(config).then((response) =>{
    return response;
});
}
  
export default {
    GetLogin
};
```

## Redux State Structure

The Redux state is organized as follows:

```javascript
{
  data: {
    data: [],           // Array of fetched items
    loading: false,     // Loading indicator
    error: null,        // Error message
  }
}
```

### State Values During API Call

```javascript
// Initial state
{ data: [], loading: false, error: null }

// While loading
{ data: [], loading: true, error: null }

// After success
{ data: [items...], loading: false, error: null }

// After error
{ data: [], loading: false, error: 'Error message' }
```

## Example: Making Your Own API Call

To fetch from a custom endpoint in your component:

```javascript
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDataThunk } from '../redux/actions';

function MyComponent() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.data);

  useEffect(() => {
    // Fetch from your API endpoint
    dispatch(fetchDataThunk('/api/products'));
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {data.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

## Handling Different Data Types

The reducer stores data in a single array. To handle different data types:

### Option 1: Use Multiple Redux Slices

```javascript
const store = configureStore({
  reducer: {
    users: usersReducer,
    posts: postsReducer,
    comments: commentsReducer,
  },
});
```

### Option 2: Enhance State Structure

```javascript
const initialState = {
  users: [],
  posts: [],
  comments: [],
  loading: false,
  error: null,
};
```

## Common Task Examples

### Fetch Data on Component Mount

```javascript
useEffect(() => {
  dispatch(fetchDataThunk('/api/data'));
}, [dispatch]);
```

### Clear Error on Dismiss

```javascript
import { clearError } from '../actions';

const handleDismiss = () => {
  dispatch(clearError());
};
```

### Conditional Rendering Based on State

```javascript
{loading && <LoadingSpinner />}
{error && <ErrorMessage message={error} />}
{!loading && !error && data.length > 0 && <DataList items={data} />}
{!loading && !error && data.length === 0 && <EmptyState />}
```

## Environment Configuration

Configure your API base URL in `.env`:

```env
REACT_APP_API_URL=http://localhost:3000/api
```

The API service will use this URL:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://BASE_URL';
```

## Debugging Redux Actions

Install Redux DevTools browser extension to debug Redux state changes:

1. Download Redux DevTools extension for Chrome/Firefox
2. The store will automatically connect to the extension
3. View all dispatched actions and state changes in real-time

## Best Practices

1. **Always use thunks for async operations** - Keep components clean
2. **Error handling** - Always dispatch error actions for failed requests
3. **Loading states** - Show spinners/skeletons during data fetching
4. **Separate concerns** - Keep API logic in services, state in reducers
5. **Use selectors** - Create reusable selectors for commonly accessed state
6. **Token storage** - Keep auth tokens in secure storage (HttpOnly cookies preferred)
7. **Request cancellation** - Cancel requests when components unmount

## Testing the Template

The `DataFetcher` component is set up to work with `JSONPlaceholder` API:

Then test by clicking the buttons in the DataFetcher component!

### State not updating?
- Check Redux DevTools for dispatched actions
- Verify reducer case statements match action types
- Ensure useSelector is getting correct state path

### API calls not working?
- Check console for CORS errors
- Verify endpoint URL in environment variables
- Check if authentication token is being sent

### Component not re-rendering?
- Ensure useSelector is properly connected to store
- Verify Redux Provider wraps the entire app
- Check for missing dependencies in useEffect

---

 
