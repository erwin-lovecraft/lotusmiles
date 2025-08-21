import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Big from 'big.js';

interface RejectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  ticketId: Big;
}

export function RejectDialog({ isOpen, onClose, onConfirm, ticketId }: RejectDialogProps) {
  const [rejectReason, setRejectReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!rejectReason.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(rejectReason.trim());
      setRejectReason("");
      onClose();
    } catch (error) {
      console.error("Failed to reject request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setRejectReason("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Từ chối yêu cầu</DialogTitle>
          <DialogDescription>
            Vui lòng nhập lý do từ chối cho yêu cầu <strong>{ticketId.toString()}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reject-reason">Lý do từ chối *</Label>
            <Textarea
              id="reject-reason"
              placeholder="Nhập lý do từ chối yêu cầu..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              disabled={isSubmitting}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="destructive"
            onClick={handleSubmit}
            disabled={!rejectReason.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              "Từ chối"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
