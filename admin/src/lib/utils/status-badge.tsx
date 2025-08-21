import { Badge } from "@/components/ui/badge";

export const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Đang chờ</Badge>;
    case "inprogress":
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Đang xử lý</Badge>;
    case "approved":
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Đã duyệt</Badge>;
    case "rejected":
      return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Từ chối</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};
