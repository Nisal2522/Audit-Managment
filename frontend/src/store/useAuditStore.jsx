import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import {toast} from 'react-hot-toast';


export const useAuditStore = create((set , get) => ({

    authUser : null,
    isSubmitting : false,
    isFetching : false,
    auditData : null,
    isLoading : false,



    reportSubmmit : async (data ) =>{
       set({ isSubmitting: true });
            try {
              const res = await axiosInstance.post("/audits/report", data);
              set({ authUser: res.data });
              toast.success("Report Submitted Successfully");
             } catch (error) {
              toast.error(error.response.data.message);
            } finally {
              set({ isSubmitting: false });
            }
          } ,

          getAudit : async (id) => {

            set({ isLoading: true });
            try {
              const res = await axiosInstance.get(`/audits/auditdetails/${id}`);
              console.log("hello");
              set({ auditData: res.data });
            } catch (error) {
              toast.error(error.response.data.message);
            } finally {
              set({ isLoading: false });
            }




          }

          

    
    





}));