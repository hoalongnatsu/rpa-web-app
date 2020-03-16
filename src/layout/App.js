import React, { Fragment } from 'react';

/* Components */
import Topbar from 'components/Topbar';

const App = ({children}) => {
  return (
    <Fragment>
      <Topbar />
      {children}
    </Fragment>
  )
}

export default App;
