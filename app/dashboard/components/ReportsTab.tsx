import Button from "@/components/Button";
import DateRangePicker from "@/components/DateRangePicker";

const ReportsTab = () => {
  return (
    <div className="flex items-center space-x-2">
      <DateRangePicker />
      <Button>Download</Button>
    </div>
  );
};

export default ReportsTab;
