import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import {
  Announcement,
  AnnouncementPayload,
  AnnouncementResponse,
  announcementsUrl,
} from "@/lib/dashboard/announcements";
import { useRef, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import LexicalEditor from "../LexicalEditor";
import { LexicalEditor as LE } from "lexical";
import { useMutateCollection } from "@/lib/hooks";
import { useToast } from "@/components/ui/use-toast";
import { constructiveToast, destructiveToast } from "@/lib/utils";
import Spinner from "@/components/Spinner";

const formSchema = z.object({
  title: z.string().max(50, {
    message: "Title must be at most 50 characters.",
  }),
});

export interface NewAnnouncementProps {
  editPayload?: {
    id: string;
    content: string;
    title: string;
  };
}

export default function AnnouncementSheet({
  editPayload,
}: NewAnnouncementProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: editPayload?.title,
    },
  });

  const editorRef: any = useRef<LE | undefined>();
  const {
    trigger: createTrigger,
    isMutating: createIsMutating,
    error: createError,
  } = useMutateCollection<
    Announcement,
    AnnouncementResponse,
    AnnouncementPayload
  >(
    announcementsUrl,
    "POST",
    (result, currentData) => {
      return { docs: [...currentData!.docs!, result] };
    },
    (data) => data
  );
  const {
    trigger: updateTrigger,
    isMutating: updateIsMutating,
    error: updateError,
  } = useMutateCollection<
    Announcement,
    AnnouncementResponse,
    AnnouncementPayload
  >(
    announcementsUrl,
    "PATCH",
    (result, currentData) => {
      return {
        docs: [
          ...currentData!.docs!.filter((val) => val.id !== result.id),
          result,
        ],
      };
    },
    (data) => data
  );
  const [open, setOpen] = useState(false);
  const auth = useAuth();
  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(JSON.stringify(editorRef.current!.getEditorState()));

    if (editPayload) {
      await updateTrigger({
        token: auth.token!,
        id: editPayload?.id,
        payload: {
          title: values.title,
          content: JSON.stringify(editorRef.current.getEditorState()),
        },
      });

      if (updateError) {
        destructiveToast(toast, "Error", "Could not update announcement")();
      } else {
        constructiveToast(toast, "Success", "Updated announcement")();
      }
    } else {
      const res = await createTrigger({
        token: auth.token!,
        payload: {
          title: values.title,
          content: JSON.stringify(editorRef.current.getEditorState()),
        },
      });
      console.log(res);

      if (createError) {
        destructiveToast(toast, "Error", "Could not create announcement")();
      } else {
        constructiveToast(toast, "Success", "Created announcement")();
      }
    }
    setOpen(false);
  }

  const isMutating = createIsMutating || updateIsMutating;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Button variant={"default"}>{editPayload ? "Edit" : "New"}</Button>
      </SheetTrigger>
      <SheetContent side={"bottom"} className="max-h-[80%] overflow-auto">
        <SheetHeader>
          <SheetTitle>{editPayload ? "Edit" : "New"} announcement</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="pt-8 space-y-4 "
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="title">Title</FormLabel>
                  <FormControl>
                    <Input {...field} id="title" type="text" required></Input>
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
            <div className="flex flex-col gap-3">
              <FormLabel htmlFor="content">Content</FormLabel>
              <LexicalEditor
                ref={editorRef}
                editorState={editPayload?.content}
              />
            </div>
            <SheetFooter>
              <Button disabled={isMutating} type="submit">
                {isMutating ? <Spinner variant="button" /> : "Submit"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
