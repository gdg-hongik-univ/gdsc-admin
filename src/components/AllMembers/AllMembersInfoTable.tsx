import { useMemo, useRef, useState } from "react";
import styled from "@emotion/styled";
import { Button, Stack } from "@mui/material";
import { DataGrid, GridCellParams, GridColDef, GridRowModel } from "@mui/x-data-grid";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import DeleteMemberModal from "./DeleteMemberModal";
import EditInfoMemberModal from "./EditMemberInfoModal";

import { QueryKey } from "@/constants/queryKey";
import {
  useAllMembersStateContext,
  useAllMembersDispatchContext,
} from "@/hooks/contexts/useAllMembersContext";
import useDeleteMemberMutation from "@/hooks/mutations/useDeleteMemberMutation";
import useGetAllMemberListQuery from "@/hooks/queries/useGetAllMemberListQuery";
import { EditMemberInfoType, MemberInfoType } from "@/types/entities/member";
const initialMemberInfo = {
  memberId: 0,
  studentId: "",
  name: "",
  phone: "",
  department: {
    code: "",
    name: "",
  },
  email: "",
  discordUsername: "",
  nickname: "",
};

export default function AllMembersInfoTable() {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editMemberId, setEditMemberId] = useState(0);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetRow, setDeleteTargetRow] = useState<GridRowModel | null>(null);

  const { mutate } = useDeleteMemberMutation();

  const {
    paginationModel,
    searchInfo: { text: searchText, variant: searchVariant },
  } = useAllMembersStateContext();
  const { setPaginationModel } = useAllMembersDispatchContext();

  const queryClient = useQueryClient();

  const { allMemberList = [], totalElements } = useGetAllMemberListQuery(
    paginationModel.page,
    paginationModel.pageSize,
    searchVariant,
    searchText,
  );

  const editMemberInfo =
    allMemberList.find(member => member.memberId === editMemberId) ||
    (initialMemberInfo as EditMemberInfoType);

  const rowCountRef = useRef(totalElements || 0);

  const rowCount = useMemo(() => {
    if (totalElements !== undefined) {
      rowCountRef.current = totalElements;
    }

    return rowCountRef.current;
  }, [totalElements]);

  const getFilteredRows = (allMemberList: MemberInfoType[]) => {
    return allMemberList.map(member => {
      const {
        memberId,
        studentId,
        name,
        phone,
        department: { name: departmentName, code: departmentCode },
        email,
        discordUsername,
        nickname,
      } = member;

      return {
        id: memberId,
        studentId,
        name,
        phone,
        departmentName,
        departmentCode,
        email,
        discordUsername,
        nickname,
      };
    });
  };

  const handleClickEditMemberInfo = (row: GridRowModel) => {
    const { id: memberId } = row;

    setEditMemberId(memberId);
    setEditModalOpen(true);
  };

  // const handleClickDeleteMember = (row: GridRowModel) => {
  //   const targetMemberId = row.id;
  //   mutate(targetMemberId, {
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({
  //         queryKey: [QueryKey.allMemberList],
  //       });
  //       toast.success("탈퇴 처리 완료하였습니다.");
  //     },
  //   });
  // };
  const handleClickDeleteMember = (row: GridRowModel) => {
    setDeleteTargetRow(row);
    setDeleteModalOpen(true);
  };

  const handleConfirmDeleteMember = () => {
    if (!deleteTargetRow) {
      return;
    }

    mutate(deleteTargetRow.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QueryKey.allMemberList],
        });
        toast.success("탈퇴 처리 완료하였습니다.");
        setDeleteModalOpen(false);
        setDeleteTargetRow(null);
      },
    });
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteTargetRow(null);
  };

  const handleCloseModal = () => {
    setEditMemberId(0);
    setEditModalOpen(false);
  };

  return (
    <>
      <StyledDataGrid
        rows={getFilteredRows(allMemberList)}
        columns={getColumns(handleClickEditMemberInfo, handleClickDeleteMember)}
        pageSizeOptions={[5, 25, 100]}
        rowCount={rowCount}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        disableRowSelectionOnClick
        autoHeight
        disableColumnFilter
        disableColumnMenu
        disableColumnSorting
      />
      <EditInfoMemberModal
        open={editModalOpen}
        onClose={handleCloseModal}
        memberInfo={editMemberInfo}
        key={editMemberId}
      />
      <DeleteMemberModal
        open={deleteModalOpen}
        memberName={deleteTargetRow?.name}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDeleteMember}
      />
    </>
  );
}

const getColumns = (
  handleClickEditMemberInfo: (row: GridRowModel) => void,
  handleClickDeleteMember: (row: GridRowModel) => void,
): GridColDef[] => [
  {
    field: "studentId",
    headerName: "학번",
    headerAlign: "left",
    minWidth: 85,
    flex: 1,
    resizable: false,
    editable: false,
  },
  {
    field: "name",
    headerName: "이름",
    headerAlign: "left",
    minWidth: 75,
    flex: 1,
    resizable: false,
    editable: false,
  },
  {
    field: "phone",
    headerName: "전화번호",
    headerAlign: "left",
    minWidth: 120,
    flex: 1,
    resizable: false,
    editable: false,
  },
  {
    field: "departmentName",
    headerName: "소속 학과",
    headerAlign: "left",
    minWidth: 270,
    flex: 1,
    resizable: false,
    editable: false,
  },
  {
    field: "email",
    headerName: "이메일",
    headerAlign: "left",
    minWidth: 215,
    flex: 1,
    resizable: false,
    editable: false,
  },
  {
    field: "discordUsername",
    headerName: "디스코드 사용자명",
    headerAlign: "left",
    minWidth: 125,
    flex: 1,
    resizable: false,
    editable: false,
  },
  {
    field: "nickname",
    headerName: "디스코드 별명",
    headerAlign: "left",
    minWidth: 100,
    flex: 1,
    resizable: false,
    editable: false,
  },
  {
    field: "editMember",
    headerName: "",
    sortable: false,
    flex: 1,
    minWidth: 156,
    renderCell: (params: GridCellParams) => {
      return (
        <StyledButtonWrapper flexDirection={"row"}>
          <StyledButton
            variant="outlined"
            color="primary"
            onClick={() => handleClickEditMemberInfo(params.row)}
          >
            수정
          </StyledButton>
          <StyledButton
            variant="outlined"
            color="error"
            onClick={() => handleClickDeleteMember(params.row)}
          >
            탈퇴
          </StyledButton>
        </StyledButtonWrapper>
      );
    },
  },
];

const StyledDataGrid = styled(DataGrid)({ border: "none", minHeight: 370 });

const StyledButtonWrapper = styled(Stack)({
  display: "flex",
  gap: 8,
  paddingTop: 9,
});

const StyledButton = styled(Button)({
  padding: "8px 22px",
  height: "32px",
});
