import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { insertPermissionRequestSchema, type InsertPermissionRequest } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { fadeInVariants } from "@/lib/animations";

export default function RequestPermission() {
  const { toast } = useToast();

  const form = useForm<InsertPermissionRequest>({
    resolver: zodResolver(insertPermissionRequestSchema),
    defaultValues: {
      companyName: "",
      websiteUrl: "",
      contactInfo: "",
      testingScope: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: InsertPermissionRequest) =>
      apiRequest("POST", "/api/permissions", data),
    onSuccess: () => {
      toast({
        title: "Request Submitted",
        description: "We will review your request and contact you soon.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen pt-24 pb-12 bg-black text-white">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
        className="container max-w-2xl mx-auto px-4"
      >
        <h1 className="text-4xl font-bold mb-8 text-center">REQUEST SECURITY TESTING PERMISSION</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-zinc-900 border-zinc-800" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="websiteUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL</FormLabel>
                  <FormControl>
                    <Input type="url" {...field} className="bg-zinc-900 border-zinc-800" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Information</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Email or phone number"
                      className="bg-zinc-900 border-zinc-800"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="testingScope"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Testing Scope</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what you want us to test"
                      className="min-h-[100px] bg-zinc-900 border-zinc-800"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-[#FF0080] hover:bg-[#FF0080]/80 text-white"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Submitting..." : "Submit Request"}
            </Button>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}