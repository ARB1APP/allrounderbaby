import React from 'react';
import { Image } from 'react-native';

const SmartImage = React.memo(({ source, style, resizeMode = 'cover', ...props }) => {
    return <Image source={source} style={style} resizeMode={resizeMode} {...props} />;
});

export default SmartImage;
