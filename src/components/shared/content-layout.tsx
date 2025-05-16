import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  title: string | ReactNode;
}

const ContentLayout = (props: Props) => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-6">
          <Link to="/" className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={20} />
          </Link>
          <p className="text-2xl font-bold text-gray-800">{props.title}</p>
        </div>
      </div>

      {props?.children}
    </div>
  );
};

export default ContentLayout;
