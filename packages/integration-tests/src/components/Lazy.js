import React, { Suspense } from 'react';
import styled from 'styled-components';

const Logo = React.lazy(() => import('./Logo'));

export default function Lazy(props) {
  return (
    <div>
      Logo:
      <Suspense fallback={<div>Loading...</div>}>
        <section>
          <Logo />
        </section>
      </Suspense>
    </div>
  );
}
