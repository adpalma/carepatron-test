import React from 'react';

export default function Page({ children, styles }: { children?: React.ReactNode, styles?: object }) {
	return <div style={{ margin: 'auto', marginTop: 48, maxWidth: '700px', ...styles }}>{children}</div>;
}
