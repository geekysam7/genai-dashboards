import Button from "@/components/Button";
import DateRangePicker from "@/components/DateRangePicker";

const ReportsTab = () => {
  return (
    <div className="flex items-start gap-4 md:gap-0 md:items-center space-x-2 flex-col md:flex-row">
      <h3 className="pl-2">Generate your reports for following dates: </h3>
      <DateRangePicker />
      <Button>Download</Button>
    </div>
  );
};

export default ReportsTab;
