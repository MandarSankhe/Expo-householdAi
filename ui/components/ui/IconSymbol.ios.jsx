import { SymbolView } from 'expo-symbols';
import { ViewStyle } from 'react-native';

export function IconSymbol(props) {
  const {
    name,
    size = 24,
    color,
    style,
    weight = 'regular',
  } = props;

  return (
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={name}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}
