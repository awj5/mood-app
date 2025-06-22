import { Alert } from "react-native";
import * as Notifications from "expo-notifications";
import Button from "components/Button";

type RemoveProps = {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Remove(props: RemoveProps) {
  const confirm = () => {
    Alert.alert(
      "Remove Reminder",
      "Are you sure you want to remove check-in reminder notifications? Reminders help you stay on track.",
      [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "Delete", onPress: remove, style: "destructive" },
      ]
    );
  };

  const remove = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync(); // Remove all existing notifications
      props.setVisible(false); // Close
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button func={confirm} large>
      Remove
    </Button>
  );
}
