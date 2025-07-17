import type { IVideo } from "@/models/Video";
export type VideoFormData = Omit<IVideo,"_id">







type FetchOPtions = {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: any;
    headers?: Record<string, string>;
}   


class ApiClient{
    private async fetch<T>(
        endpoint:string,
        options:FetchOPtions={}
    ): Promise<T> {
        const {method = 'GET', body, headers = {}}=options 

        const defaultHeaders = {
            'Content-Type':"application/json",
            ...headers
        }
       const response: Response = await fetch(`/api/${endpoint}`,{
            method,
            headers: defaultHeaders,
            body: body ? JSON.stringify(body) : undefined
        })

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return response.json()
 }
 async getVideos(){
    return this.fetch<IVideo[]>("auth/video");
 }
 async createVideo(video:VideoFormData){
    return this.fetch<IVideo>("/videos", {
        method: "POST",
        body: video
    });
 }

}

export const apiClient = new ApiClient();