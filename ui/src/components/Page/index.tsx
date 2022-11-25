import React from 'react';

export default function Page({ children }: { children?: React.ReactNode }) {
	return <div style={{ margin: 'auto', marginTop: 48, maxWidth: '700px' }}>{children}</div>;
}
