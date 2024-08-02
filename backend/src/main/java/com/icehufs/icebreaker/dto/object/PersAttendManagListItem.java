package com.icehufs.icebreaker.dto.object;
import java.util.ArrayList;
import java.util.List;

import com.icehufs.icebreaker.entity.CodingZoneClass;
import com.icehufs.icebreaker.entity.CodingZoneRegisterEntity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PersAttendManagListItem {
    private String className;
    private Integer registrationId;
    private String classDate;
    private String classTime;
    private String assistantName;
    private String attendance;

    // 복사 생성자
    public PersAttendManagListItem(PersAttendManagListItem other) {
        this.className = other.className;
        this.registrationId = other.registrationId;
        this.classDate = other.classDate;
        this.classTime = other.classTime;
        this.assistantName = other.assistantName;
        this.attendance = other.attendance;
    }

    // 해당 생성자는 CodingZoneClass와 CodingZoneRegisterEntity 인스턴스를 기반으로 새 PersAttendManagListItem 객체를 초기화
    public PersAttendManagListItem(CodingZoneClass codingZoneClass, CodingZoneRegisterEntity codingZoneRegisterEntity) {
        this.className = codingZoneClass.getClassName();
        this.classDate = codingZoneClass.getClassDate();
        this.classTime = codingZoneClass.getClassTime();
        this.assistantName = codingZoneClass.getAssistantName();
        this.registrationId = codingZoneRegisterEntity.getRegistrationId();
        this.attendance = codingZoneRegisterEntity.getAttendance();
    }

    // 객체 리스트에서 각 객체를 복사하여 새 리스트를 생성
    public static List<PersAttendManagListItem> getList(List<PersAttendManagListItem> persAttendManagListItems) {
        List<PersAttendManagListItem> list = new ArrayList<>();
        for (PersAttendManagListItem item : persAttendManagListItems) {
            list.add(new PersAttendManagListItem(item));
        }
        return list;
    }
}