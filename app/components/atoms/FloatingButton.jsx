import { Button, Icon } from '@ui-kitten/components';

const FloatingButton = ({ iconName, onPress }) => {
  return (
    <Button
      onPress={onPress}
      accessoryLeft={(props) => <Icon {...props} name={iconName} />}
      style={{
        position: 'absolute',
        bottom: 16,
        right: 16,
        zIndex: 999,
        borderRadius: 50,
        paddingVertical: 20,
        elevation: 6,
      }}
    />
  );
};

export default FloatingButton;
