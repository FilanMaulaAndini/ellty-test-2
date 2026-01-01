import { Node } from "@/app/shared/types/post";
import BaseApiFetch from "./base";

interface CreatePayload {
  value: number;
}

interface CreateResponse {
  message: string;
  user?: {
    id: string;
    email?: string;
    username?: string;
  };
}

interface RespondPayload {
  operation: string;
  rightOperand: number;
}

class PostApi extends BaseApiFetch {
  async create(json: CreatePayload): Promise<CreateResponse> {
    return this.fetch("/nodes/start", "POST", {
      json,
      isPrivate: true,
    });
  }

  async getPost(): Promise<Node[]> {
    return this.fetch("/nodes/", "GET", {
      isPrivate: false,
    });
  }

  async respondNode(json: RespondPayload, id: string): Promise<Node[]> {
    return this.fetch(`/nodes/${id}/respond`, "POST", {
      isPrivate: true,
      json,
    });
  }
}

const postApi = new PostApi();

export default postApi;
