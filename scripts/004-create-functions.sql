-- Function to update user total points
CREATE OR REPLACE FUNCTION public.update_user_points()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update the user's total points when a point transaction is added
  UPDATE public.profiles 
  SET total_points = (
    SELECT COALESCE(SUM(points), 0) 
    FROM public.point_transactions 
    WHERE user_id = NEW.user_id
  )
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

-- Trigger to update total points when transactions change
DROP TRIGGER IF EXISTS on_point_transaction_change ON public.point_transactions;
CREATE TRIGGER on_point_transaction_change
  AFTER INSERT OR UPDATE OR DELETE ON public.point_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_points();
