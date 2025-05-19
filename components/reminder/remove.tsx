import * as Notifications from "expo-notifications";
import Button from "components/Button";

type RemoveProps = {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Remove(props: RemoveProps) {
  const remove = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync(); // Remove all existing notifications
      props.setVisible(false); // Close
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button func={remove} destructive large>
      Remove
    </Button>
  );
}
