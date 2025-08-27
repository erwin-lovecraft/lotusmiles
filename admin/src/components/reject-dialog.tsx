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
import { useTranslation } from "react-i18next";

interface RejectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  ticketId: string;
}

export function RejectDialog({ isOpen, onClose, onConfirm, ticketId }: RejectDialogProps) {
  const { t } = useTranslation();
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
          <DialogTitle>{t('rejectDialog.title')}</DialogTitle>
          <DialogDescription>
            {t('rejectDialog.description', { requestId: ticketId.toString() })}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reject-reason">{t('rejectDialog.rejectionReason')} *</Label>
            <Textarea
              id="reject-reason"
              placeholder={t('rejectDialog.rejectionReasonPlaceholder')}
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
            {t('common.cancel')}
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
                {t('common.processing')}
              </>
            ) : (
              t('requestTicket.reject')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
